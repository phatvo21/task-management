/**
 * This re-exporting of OrmConfig is to satisfy a missing feature/bug in TypeOrm wherein it requires a CommonJS style default export (module.exports=? / export=?) for its CLI to work properly
 */
import {OrmConfig} from 'constants/TypeormConfig';

export = OrmConfig;
