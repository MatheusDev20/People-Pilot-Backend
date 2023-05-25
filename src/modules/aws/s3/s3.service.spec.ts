import { S3Service } from './s3.service';
import { CustomLogger } from '../../logger/services/logger.service';
import { FileAppResources } from 'src/@types';

const makeFileRequest = (): { file: Express.Multer.File; resource: FileAppResources } => {
  return {
    file: {
      encoding: 'image/jpg',
      originalname: 'test.jpg',
      fieldname: 'fieldname-test',
      stream: null,
      destination: 'destination-test',
      path: 'path-test',
      size: 1024,
      filename: 'filename-test',
      buffer: Buffer.from('file content'),
      mimetype: 'image/jpeg',
    },
    resource: 'employee_avatar',
  };
};

describe('S3Service', () => {
  let s3Service: S3Service;
  let logger: CustomLogger;

  beforeEach(() => {
    logger = new CustomLogger();
    s3Service = new S3Service(logger);
  });
  describe('Persiste file on s3', () => {
    it('Should call persist method with the correct arguments', async () => {
      const persistSpy = jest.spyOn(s3Service, 'persist');
      const { file, resource } = makeFileRequest();
      await s3Service.persist(file, resource);
      expect(persistSpy).toHaveBeenCalledWith(file, resource);
    });
  });
});
