import uploadController from "../controller/upload.controller";
import config from "../config/base.config";

describe("File Upload API Tests", () => {
  it("POST /upload/single", async () => {
    const filepath = "data/beach.jpg";
    const response = await uploadController.postUploadSingleFile(filepath);
    console.log(response.body);
    expect(response.body.filename).toEqual("beach.jpg");

    expect(response.statusCode).toEqual(200);
  });

  it("POST /upload/multiple", async () => {
    const files = ["data/beach.jpg", "data/coffee.jpg"];
    const response = await uploadController.postUploadMultipleFiles(files);
    console.log(response.body);

    expect(response.statusCode).toEqual(200);

    // Assert response is an array with correct length
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(files.length);
    expect(response.body[0].filename).toEqual("beach.jpg");
    expect(response.body[1].filename).toEqual("coffee.jpg");
  });
});
