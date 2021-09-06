import {factory} from 'factory-girl';
// @ts-ignore
import {TypeOrmAdapter} from './adapter';
// @ts-ignore
import {defineUserFactory} from './user';
// @ts-ignore
import {defineTaskFactory} from './task';

/**
 * Generates and defines a factory object that can create all of our data models
 */

factory.setAdapter(new TypeOrmAdapter());

defineUserFactory(factory);

defineTaskFactory(factory);

export {factory};
