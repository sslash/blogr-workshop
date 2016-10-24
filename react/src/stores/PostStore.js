import AppDispatcher from '../dispatcher/AppDispatcher';
import { AppConstants } from '../constants/AppConstants';
import { EventEmitter } from 'events';

// Private data and functions.
const CHANGE_EVENT = 'change';

// Set the selected post.
function _setSelectedPost(index){
    _store.post = _store.posts[index];
}

// Set the selected post.
function _setPosts(posts){
    _store.posts = posts;
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
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  getPosts() {
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

  switch (action.type) {
      case AppConstants.CLICK_POST:
        _setSelectedPost(action.index);
        PostStore.emit(CHANGE_EVENT);
        break;
      case AppConstants.REQUEST_POSTS_SUCCESS:
        _setPosts(action.response.data.data);
        PostStore.emit(CHANGE_EVENT);
        break;
      default:
        return true;
  }
});

export default PostStore;