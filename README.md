# Springboard-Capstone-Production

Production repository for my Machine Learning UC San Diego
Extended Studies Capstone project.

We will use a pretrained object detection model to find and draw bounding boxes
over a given input image.

The detection model used is an SSD architecture trained on the 2017 COCO dataset,
and hosted by tensorflow.js from the model Hub.

---

## Usage

Clone this repository and open a console in the frontend/ directory. Then run the following
steps in the console.

- 'npm install' to install project dependencies
- 'npm run css-build' to build the page styling
- 'npm start' to run the react app locally

The user is currently able to upload a local image from their machine, and click the
'predict' button to display bounding boxes over objects of interest.

The 'info' button displays the objects the detection model can find.

---

## Minimum Viable Product Definition of Done

- User should be able to upload an image and view them on the
  main page.
- User should be able to click a button that queries a prediction api.
- The user should be able to view those bounding box predictions drawn
  over the original image.

---

## References

Coco-ssd package used for inference

- https://www.npmjs.com/package/@tensorflow-models/coco-ssd
- https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
