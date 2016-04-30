import { Dispatcher } from 'flux';
import { log } from '../actions/LogActions';

class DispatcherClass extends Dispatcher {

  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action,
    });

    log(action);
  }

  handleServerAction(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action,
    });

    log(action);
  }
}

const AppDispatcher = new DispatcherClass();
export default AppDispatcher;
