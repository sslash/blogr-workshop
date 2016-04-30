import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';

export function clickPost(index) {
    console.log("Click Post index:"+index)
    AppDispatcher.handleViewAction({
      action: AppConstants.CLICK_POST,
      index: index
    });
}
