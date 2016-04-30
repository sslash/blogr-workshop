import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';

export function loadPostsResponse(response) {
    AppDispatcher.handleServerAction({
      type: AppConstants.REQUEST_POSTS_SUCCESS,
      response: response
    });
}
