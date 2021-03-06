import express, { Router, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import axios from 'axios';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user


  const imageRouter = Router();
  imageRouter.get('/', async (req, res, next) => {
    
    try {
      console.log(req.query.image_url);
      if(req.query.image_url){
        await axios.head( req.query.image_url, {timeout:500})
        next();
      } else {
        throw new Error("Provide valid query!")
      }
    } catch (err) {
      res.status(422).send(err.message)
    }

  });
  
  const handleImageFile: RequestHandler = async (req, res) => {
    try {
      res.locals.filtered_image = await filterImageFromURL(req.query.image_url)
      console.log("send file!")
      res.status(200).sendFile(res.locals.filtered_image);
      res.on("finish", () => {
        console.log("delete file!")
        deleteLocalFiles([res.locals.filtered_image]);
      });
    } catch (err) {

    }
  }
  
  app.get( "/", async ( _req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  app.use('/filteredimage', imageRouter, handleImageFile);

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();