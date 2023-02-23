# Springboard-Capstone-Production

Production repository for my Machine Learning UC San Diego
Extended Studies Capstone project.

We will use pretrained object detection methods to render
bounding boxes and labels over our original image.

---

## Minimum Viable Product Definition of Done

- User should be able to upload an image and view them on the
  main page.
- User should be able to click a button that queries the backend
  prediction api.
- The user should be able to view those bounding box predictions
  over the original image.

---

## Production notes

Followed this guide for hosting my site on AWS
https://adamraudonis.medium.com/how-to-deploy-a-website-on-aws-with-docker-flask-react-from-scratch-d0845ebd9da4

Since I work on windows, I used 'waitress' instead of 'gunicorn'.
waitress-serve --listen=127.0.0.1:5000 wsgi:app

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

- Flask backend with PyTorch: https://pytorch.org/tutorials/intermediate/flask_rest_api_tutorial.html
- Converting bytestring to blob: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
