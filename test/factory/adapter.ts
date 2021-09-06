import {DefaultAdapter} from 'factory-girl';
import {getRepository} from 'typeorm';

export class TypeOrmAdapter extends DefaultAdapter {
  build(Model, props): Promise<any> {
    const entityManager = getRepository(Model);
    return entityManager.save(props);
  }
}
