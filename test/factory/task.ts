// @ts-ignore
import {taskFactoryWorker} from './workers/task';
import {Tasks} from 'databases/entities/Tasks';

/**
 * Defines all the task schematics for a factory
 * @param {object} factory - Factory-Girl factory object
 */
export function defineTaskFactory(factory) {
  factory.define('task', Tasks, taskFactoryWorker);
}
