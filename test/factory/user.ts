// @ts-ignore
import {userFactoryWorker} from './workers/user';
import {Users} from 'databases/entities/Users';

/**
 * Defines all the user schematics for a factory
 * @param {object} factory - Factory-Girl factory object
 */
export function defineUserFactory(factory) {
  factory.define('user', Users, userFactoryWorker);
}
