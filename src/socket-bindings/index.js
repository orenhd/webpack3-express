import * as paintSocketBindings from './paint-socket';

export function bind(io) {

    paintSocketBindings.bind( io.of('/paint-socket') );

}