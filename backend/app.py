# import libraries
import io
import json
import base64
from PIL import Image

# import torch libraries
import torch
from torchvision import models
from torchvision.models.detection import ssdlite320_mobilenet_v3_large
import torchvision.transforms as T
from torchvision.utils import draw_bounding_boxes

# import flask methods
from flask import Flask, jsonify, request, send_file


app = Flask(__name__)
model = ssdlite320_mobilenet_v3_large(weights='DEFAULT',
                                      box_score_thresh=0.9)
model.eval()


# converts the image bytes to a PIL image, and transforms it into an appropriately
# sized tensor of the shape [1, 320, 320, 3]
def transform_image(image_bytes):
    my_transforms = T.Compose([T.Resize(320),
                               T.ToTensor()])
    image = Image.open(io.BytesIO(image_bytes))
    return my_transforms(image).unsqueeze(0)


# transform the image, and return image object predictions
# pred: {'boxes', 'labels', 'scores'}
def get_prediction(image_bytes):
    tensor = transform_image(image_bytes=image_bytes)
    pred = model(tensor)
    return pred


# call get_prediction, and print to console, does not return anything useful to frontend yet
@app.route('/get-preds', methods=['POST'])
def get_preds():
    if request.method == 'POST':
        file = request.files['file']
        image_bytes = file.read()
        pred = get_prediction(image_bytes)
        print('prediction:', pred)
        
        return jsonify({'class_id': 0, 'class_name': 'nothing'})


# simple route that draws a box using torch's draw_bounding_boxes, then
# returns the image to the frontend
@app.route('/draw-boxes', methods=['POST'])
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
