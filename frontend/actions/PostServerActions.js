import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';

export function loadPostsResponse(response) {
    console.log("loadPostsResponse");
    AppDispatcher.handleServerAction({
      action: AppConstants.LOAD_POSTS_RESPONSE,
      response: response
    });
}
