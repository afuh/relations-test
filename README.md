# Test relationships

run `npm start` or `npm run ui`

`http://localhost:8080`
### Endpoints
- register: `/login`
- logout: `/logout`
- userpage: `/:username`
- upload: `/upload`
- view an image: `/p/:image-url`
- Categories: `/category`


## Relationships
- **Image schema** has references to:
  - **User schema** The author of the image.
  - **Comments schema** The comments of the image, which has references to:
    - **User schema** The author of the comment.
    - **Image schema** The image that has been commented.
      - ...
      - ...

The **Image schema** can receive an array of categories selected by the user and managed by the method `.getCategoriesList()` which has been added as a static method to the image schema.

The **Comment model** is referenced as a virtual property in the **Image schema**, therefore it won't show up 'inside' the Image model in de database.

*All the references are populated*
