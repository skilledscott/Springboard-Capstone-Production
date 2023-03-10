# Springboard-Capstone-Production

Production repository for my Machine Learning UC San Diego
Extended Studies Capstone project.

We will use pretrained object detection methods to render
bounding boxes and labels over a given input image.

---

## Usage

After pulling this repository, open a terminal in the frontend/ directory and run
'npm start'. This runs the React app in development mode, and gives you a localhost
url to view the page.

The user is currently able to upload a local image from their machine, and click the
'predict' button to display bounding boxes over objects of interest.

---

## Deployed Product

The final product is deployed on AWS using S3 buckets for storage, and CloudFront to host
the actual site.

It can be visited by going to this link: https://d9f7uy5rshlp3.cloudfront.net/

---

Deployed AWS CloudFront web app: https://d9f7uy5rshlp3.cloudfront.net

---

## Minimum Viable Product Definition of Done

- User should be able to upload an image and view them on the
  main page.
- User should be able to click a button that queries a prediction api.
- The user should be able to view those bounding box predictions drawn
  over the original image.

---

## Production notes

Build the frontend using 'npm run build', and then sync the frontend to an AWS S3 bucket. (Note: the bucket needed to
be made with ACL allowed.)

- cd frontend
- npm run build
- aws s3 sync build/ s3://<bucket_name> --acl public-read

---

## Backlog user stories

- The user can upload a directory with many images, along with 
  optional labels for bounding boxes.
- The user can fetch predictions on batches of many images.
- The user can choose to draw comparisons of the bounding boxes
  they provide, alongside the model predictions.
- The user can choose between many different models saved in
  the backend.
- The user can go to a separate page and create bounding box labels
  and coordinates for their image, and save them to a csv file.

---

## References

Coco-ssd package used for inference
- https://www.npmjs.com/package/@tensorflow-models/coco-ssd
- https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
