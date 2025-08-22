import { CidEntity } from '../entities/cid.entity';

export interface ICidRepository {
  create(cid: Partial<CidEntity>, idUser: string): Promise<CidEntity>;
  findCidByCid(cid: string, idUser: string): Promise<CidEntity | null>;
  findAllCids(idUser: string): Promise<CidEntity[]>;
}
