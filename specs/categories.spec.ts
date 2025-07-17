import controller from "../controller/categories.controller";
import adminController from "../controller/admin.controller";
import config from "../config/base.config";

describe("Categories API Tests", () => {
  it("GET /categories", async () => {
    const response = await controller.getCategories();
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(1);
    expect(Object.keys(response.body[0])).toEqual(["_id", "name"]);
  });

  describe("Create Category", () => {
    let token: string;
    beforeAll(async () => {
      const response = await adminController.postAdminLogin({
        email: config.email,
        password: config.password,
      });
      token = response.body.token;
    });

    it("POST /categories", async () => {
      const body = {
        name: "API Automation Category " + Math.floor(Math.random() * 100000),
      };
      const response = await controller
        .postCategories(body)
        .set("Authorization", `Bearer ${token}`);
      console.log(response.body);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(body.name);
    });
  });

  describe("Update Category", () => {
    let token: string;
    let categoryId: string;
    beforeAll(async () => {
      const response = await adminController.postAdminLogin({
        email: config.email,
        password: config.password,
      });
      token = response.body.token;
      const body = {
        name: "Automation Category " + Math.floor(Math.random() * 100000),
      };
      const postResponse = await controller
        .postCategories(body)
        .set("Authorization", `Bearer ${token}`);
      console.log(postResponse.body);
      categoryId = postResponse.body._id;
    });

    afterAll(async () => {
      await controller
        .deleteCategory(categoryId)
        .set("Authorization", `Bearer ${token}`);
    });

    it("PUT /categories/{id}", async () => {
      const body = {
        name: "Updated Category",
      };
      const response = await controller
        .putCategories(categoryId, body)
        .set("Authorization", `Bearer ${token}`);
      console.log(response.body);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(body.name);
    });
  });

  describe("Delete Category", () => {
    let token: string;
    let categoryId: string;
    beforeAll(async () => {
      const response = await adminController.postAdminLogin({
        email: config.email,
        password: config.password,
      });
      token = response.body.token;
      const body = {
        name: "API Automation Category " + Math.floor(Math.random() * 100000),
      };
      const postResponse = await controller
        .postCategories(body)
        .set("Authorization", `Bearer ${token}`);
      categoryId = postResponse.body._id;
    });

    it("DELETE /categories/{id}", async () => {
      const response = await controller
        .deleteCategory(categoryId)
        .set("Authorization", `Bearer ${token}`);
      console.log(response.body);
      expect(response.statusCode).toEqual(200);
    });
  });
});
