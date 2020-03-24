import express from "express";
import routes from "../routes";
import {
    videoDetail,
    getEditVideo,
    deleteVideo,
    getUpload,
    postUpload,
    postEditVideo
}
    from "../controller/videoController";
import { uploadVideo, onlyPublic, onlyPrivate } from "../middlewares";

const videoRouter = express.Router();

//videoRouter.get(routes.video, video);

//upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

//video Detail
videoRouter.get(routes.videoDetail(), videoDetail);

// Edit Video
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);


// Delete Video
videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default videoRouter;
