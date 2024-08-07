/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3Service } from '../../src/modules/aws/s3/s3.service';
import { CustomLogger } from '../../src/modules/logger/services/logger.service';
import { FileAppResources } from 'src/@types';
import { Test } from '@nestjs/testing';
import * as helpers from '../../src/modules/aws/helpers';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getMonthName } from 'src/helpers';

const makeFileRequest = (): {
  file: Express.Multer.File;
  resource: FileAppResources;
} => {
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
const makeSdkInput = (
  file: Express.Multer.File,
  resource: FileAppResources,
): PutObjectCommand => {
  const input = {
    Bucket: 'peoplepilot',
    Key: helpers.buildS3Path(file.originalname, resource),
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' as any,
  };
  return new PutObjectCommand(input);
};

class S3ClientStub {
  send = jest.fn();
}

describe('S3Service', () => {
  let s3Service: S3Service;
  let logger: CustomLogger;
  let mockedClient: S3ClientStub;

  beforeEach(async () => {
    mockedClient = new S3ClientStub();
    const moduleRef = await Test.createTestingModule({
      providers: [S3Service, CustomLogger],
    }).compile();

    s3Service = moduleRef.get<S3Service>(S3Service);
    logger = moduleRef.get<CustomLogger>(CustomLogger);
    s3Service.client = mockedClient as any;
  });

  describe('Persiste file on s3', () => {
    it('Should correctly build the S3 Path for the file', async () => {
      const date = new Date();
      const buildPathSpy = jest.spyOn(helpers, 'buildS3Path');
      const { file, resource } = makeFileRequest();
      const s3Path = helpers.buildS3Path(file.filename, resource);

      expect.assertions(2);
      expect(buildPathSpy).toHaveBeenCalledWith(
        'filename-test',
        'employee_avatar',
      );
      expect(s3Path).toEqual(
        `people-pilot-employee_avatar/${date.getFullYear()}/${getMonthName(
          date.getMonth() + 1,
        )}/filename-test`,
      );
    });

    it('Should call persist method with the correct arguments', async () => {
      const persistSpy = jest.spyOn(s3Service, 'persist');
      const { file, resource } = makeFileRequest();
      await s3Service.persist(file, resource);
      expect.assertions(1);
      expect(persistSpy).toHaveBeenCalledWith(file, resource);
    });

    it('Should call send method with the rigth input', async () => {
      const sendSpy = jest.spyOn(mockedClient, 'send');
      const { file, resource } = makeFileRequest();
      const command = makeSdkInput(file, resource);
      await s3Service.persist(file, resource);
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });
  });
});
