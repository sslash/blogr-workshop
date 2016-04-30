import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';
import { EventEmitter } from 'events';

// Private data and functions.
const CHANGE_EVENT = 'change';

// Set the selected post.
function _setSelectedPost(index){
    console.log("_setSelectedPost: "+index)
    _store.post = _store.posts[index];
}

// The data for this store.
let _store = {
  posts: [],
  post : null
};

// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class PostStoreClass extends EventEmitter {

  addChangeListener(cb) {
    console.log("addChangeListener");
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    console.log("removeChangeListener");
    this.removeListener(CHANGE_EVENT, cb);
  }

  getPosts() {
    console.log("PostStore getPosts");
    return _store;
  }

  get(id) {
    return _store.posts[id];
  }

  getAll() {
    return _store.posts;
  }
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const PostStore = new PostStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a change
AppDispatcher.register((payload) => {
  const action = payload.action;
  console.log("PostStore action switch");

  switch (action.action) {
      case AppConstants.CLICK_POST:
        console.log("PostStore action CLICK_POST: "+action.index);
        _setSelectedPost(action.index);

        PostStore.emit(CHANGE_EVENT);
        break;
      default:
        return true;
  }
});

export default PostStore;