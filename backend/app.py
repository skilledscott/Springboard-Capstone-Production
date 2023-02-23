# import libraries
import io
import json
import base64
from PIL import Image

# import torch libraries
import torch
from torchvision import models
import torchvision.transforms as T
from torchvision.utils import draw_bounding_boxes
from torchvision.models.detection import fasterrcnn_resnet50_fpn, FasterRCNN_ResNet50_FPN_Weights

# import flask methods
from flask import Flask, jsonify, request, send_file

# init flask app
app = Flask(__name__)

# init model in eval mode
weights = FasterRCNN_ResNet50_FPN_Weights.DEFAULT
transforms = weights.transforms()
model = fasterrcnn_resnet50_fpn(weights=FasterRCNN_ResNet50_FPN_Weights.DEFAULT,
                                box_score_thresh=0.5)
model.eval()


# transform the image, and return image object predictions
# pred: {'boxes', 'labels', 'scores'}
def get_prediction(image):
    batch = [transforms(image)]
    pred = model(batch)
    return pred

# uses the model weights metadata to translate the label numbers into
# understandable categories like 'car', or 'bike'
def convert_labels_to_categories(labels):
    return [weights.meta["categories"][i] for i in labels]


# call get_prediction, and print to console, does not return anything useful to frontend yet
@app.route('/api/get-preds', methods=['POST'])
def get_preds():
    if request.method == 'POST':
        file = request.files['file']
        image_bytes = file.read()

        # open image into a PIL Image object
        image = Image.open(io.BytesIO(image_bytes))
        
        # preds : {'boxes', 'labels', 'scores'}
        pred = get_prediction(image)[0]
        
        # transform image from PIL to Tensor
        torch_image = T.PILToTensor()(image)

        # add 'categories' to prediction, this is the string equivalent of
        # the numeric label ids
        pred['categories'] = convert_labels_to_categories(pred['labels'])

        # draw bounding boxes over torch_image
        box_image = draw_bounding_boxes(torch_image, 
                                        boxes=pred['boxes'],
                                        labels=pred['categories'],
                                        width=2,
                                        colors='red')
        
        # transform image back to PIL image
        output_image = T.ToPILImage()(box_image)

        # Save the image as a JPEG
        data = io.BytesIO()
        output_image.save(data, 'JPEG')

        # convert saved image to base64 string
        encoded_image_data = base64.b64encode(data.getvalue())

        # convert encoded data to string and return through json
        return {'output_image': encoded_image_data.decode('utf-8')}


# simple route that draws a box using torch's draw_bounding_boxes, then
# returns the image to the frontend
@app.route('/api/draw-boxes', methods=['POST'])
def detect_api():
    # hardcoded prediction for debugging purposes
    prediction = {
        'boxes': [[100, 100, 200, 200]],
        'labels': ['car'],
        'scores': [1.0]
    }

    if request.method == 'POST':
        # read file sent in post request as bytes
        file = request.files['file']
        image_bytes = file.read()
        
        # transforms = T.Compose([T.Resize(320),
        #                         T.PILToTensor()])
        # create image transforms
        transforms = T.PILToTensor()

        # open image into a PIL Image object
        image = Image.open(io.BytesIO(image_bytes))

        # transform image from PIL to Tensor
        torch_image = transforms(image)

        # draw bounding boxes over torch_image
        box_image = draw_bounding_boxes(torch_image, 
                                        torch.Tensor(prediction['boxes']),
                                        width=4,
                                        colors='red')

        # transform image back to PIL image
        transforms = T.ToPILImage()
        output_image = transforms(box_image)

        # Save the image as a JPEG
        data = io.BytesIO()
        output_image.save(data, 'JPEG')

        # convert saved image to base64 string
        encoded_image_data = base64.b64encode(data.getvalue())

        # convert encoded data to string and return through json
        return {'output_image': encoded_image_data.decode('utf-8')}
