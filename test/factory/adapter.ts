import {DefaultAdapter} from 'factory-girl';
import {getRepository} from 'typeorm';

/**
 * Adapters provide support for different databases and ORMs.
 * Adapters can be registered for specific models, or as the 'default adapter',
 * which is used for any models for which an adapter has not been specified
 */
export class TypeOrmAdapter extends DefaultAdapter {
  build(Model, props): Promise<any> {
    const entityManager = getRepository(Model);
    return entityManager.save(props);
  }
}
