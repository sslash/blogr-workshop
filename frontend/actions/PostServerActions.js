import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';

export function loadPostsResponse(response) {
    AppDispatcher.handleServerAction({
      type: AppConstants.LOAD_POSTS_RESPONSE,
      response: response
    });
}
