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

## Deployed Product

The final product is deployed on AWS using S3 buckets for storage, and CloudFront to host
the actual site.

It can be visited by going to this link: https://d9f7uy5rshlp3.cloudfront.net/

---

## Minimum Viable Product Definition of Done

- User should be able to upload an image and view them on the
  main page.
- User should be able to click a button that queries a prediction api.
- The user should be able to view those bounding box predictions drawn
  over the original image.

---

## User Stories to implement

- (DONE) User should see labels over bounding boxes
- (DONE) User should be able to see which objects the model is
  looking for.
- (NOT IMPLEMENTED) User should be able to hover over a bounding box and
  highlight respective label/score on the right side

---

## Production notes

Using the following commands, build the frontend and sync to an AWS S3 bucket.

- cd frontend
- npm run build
- aws s3 sync build/ s3://<bucket_name> --acl public-read

---

## Backlog user stories

- The user can fetch predictions on batches of many images.
- The user can choose to draw comparisons of the bounding boxes
  they provide, alongside the model predictions, and get a score for how
  well the model performed.
- The user can choose between many different models saved in
  the backend.
- The user can go to a separate page and create bounding box labels
  and coordinates for their image, and save them to a csv file.

---

## References

Coco-ssd package used for inference
- https://www.npmjs.com/package/@tensorflow-models/coco-ssd
- https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
