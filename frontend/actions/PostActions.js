import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';
import { loadPostsFromServer } from '../stores/BlogrApi';

export function clickPost(index) {
    AppDispatcher.handleViewAction({
      type: AppConstants.CLICK_POST,
      index: index
    });
}

export function loadPosts() {
  AppDispatcher.handleViewAction({
    type: AppConstants.LOAD_POSTS,
  });

  loadPostsFromServer();
}
