import supertest from "supertest";

const request = supertest("https://practice-react.sdetunicorns.com/api/test");

type Brand = {
  name: string;
  description?: string;
  _id?: string;
  createdAt?: string;
};

describe("Brands API Tests", () => {
  describe("Create Brands", () => {
    let postBrand: any;
    const data = {
      name: "API Automation Brand " + Math.floor(Math.random() * 100000),
      description: "Automation Brand Desc",
    };

    beforeAll(async () => {
      postBrand = await request.post("/brands").send(data);
    });

    afterAll(async () => {
      await request.delete("/brands/" + postBrand._id);
    });

    it("POST /brands", async () => {
      expect(postBrand.statusCode).toEqual(200);
      expect(postBrand.body.name).toEqual(data.name);
      expect(postBrand.body).toHaveProperty("createdAt");
    });

    it("Schema verification - Name is a mandatory field", async () => {
      const data = {
        name: "",
        description: "Automation Brand Desc",
      };
      const response = await request.post("/brands").send(data);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Name is required");
    });

    it("Schema verification - Min character length for the Name field > 1", async () => {
      const data = {
        name: "a",
        description: "Automation Brand Desc",
      };
      const response = await request.post("/brands").send(data);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Brand name is too short");
    });

    it("Business Logic verification - Duplicate brand name not allowed", async () => {
      const response2 = await request.post("/brands").send(data);
      expect(response2.statusCode).toEqual(422);
      expect(response2.body.error).toContain("already exists");
    });
  });

  describe("FETCH Individual Brands: /brands/{id}", () => {
    let postBrand: Brand;

    beforeAll(async () => {
      const data = {
        name: "API Automation Brand " + Math.floor(Math.random() * 100000),
        description: "Automation Brand Desc",
      };
      const response = await request.post("/brands").send(data);
      postBrand = response.body;
    });

    afterAll(async () => {
      await request.delete("/brands/" + postBrand._id);
    });

    it("GET /brands/{id}", async () => {
      const response = await request.get("/brands/" + postBrand._id);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(postBrand.name);
    });

    it("Business Logic - GET /brands/{invalid_id} should throw 404", async () => {
      const response = await request.get("/brands/123456789012345678901234");
      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toEqual("Brand not found.");
    });
  });

  describe("FETCH ALL Brands", () => {
    it("GET /brands", async () => {
      const response = await request.get("/brands");

      // Verify the status code
      expect(response.statusCode).toBe(200);

      // Verify the response body lenght should be greater than 1
      expect(response.body.length).toBeGreaterThan(1);

      // verify the property names of the brand like _id and name
      expect(Object.keys(response.body[0])).toEqual(["_id", "name"]);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("name");
    }, 10000); // 10 second timeout for this specific test
  });

  describe("Update Brands", () => {
    let newBrand: Brand;

    beforeAll(async () => {
      const data = {
        name: "API Automation Brand " + Math.floor(Math.random() * 1000),
        description: "Automation Brand Desc",
      };
      const response = await request.post("/brands").send(data);
      newBrand = response.body; // Store the new brand for later use
    });

    afterAll(async () => {
      await request.delete("/brands/" + newBrand._id);
    });

    it("PUT /brands/{id}", async () => {
      // Use a shorter name to avoid "Brand name is too long" error
      const data = {
        name: "Updated Brand " + Math.floor(Math.random() * 1000),
      };
      const response = await request.put("/brands/" + newBrand._id).send(data);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(data.name);
      expect(response.body).toHaveProperty("updatedAt");

      // Update the stored brand object for potential future use
      newBrand.name = data.name;
    });

    it("Schema verification - Max Char length for the Name field = 30", async () => {
      const data = {
        name: "This is a very long brand name that exceeds the limit",
      };
      const response = await request.put("/brands/" + newBrand._id).send(data);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Brand name is too long");
    });

    it("Schema verification - Description must be a string", async () => {
      const data = {
        name: "Valid Brand Name",
        description: 12345, // Invalid type
      };
      const response = await request.put("/brands/" + newBrand._id).send(data);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Brand description must be a string");
    });

    it("Business Logic - Should throw an error when updating a non-existing brand", async () => {
      const data = {
        name: "Updated Brand Name",
      };
      const response = await request.put("/brands/" + 1234567).send(data);
      console.log(response.body);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Unable to update brands");
    });
  });

  describe("Delete Brands", () => {
    let newBrand: Brand;
    beforeAll(async () => {
      const data = {
        name: "API Automation Brand " + Math.floor(Math.random() * 1000),
        description: "Automation Brand Desc",
      };
      const response = await request.post("/brands").send(data);
      newBrand = response.body; // Store the new brand for later use
    });
    it("DELETE /brands/{id}", async () => {
      const response = await request.delete("/brands/" + newBrand._id);
      expect(response.statusCode).toEqual(200);
    });

    it("Business Logic - Should throw error when deleting a non-existing brand", async () => {
      const response = await request.delete("/brands/" + 1234567890);
      expect(response.statusCode).toEqual(422);
      expect(response.body.error).toEqual("Unable to delete brand");
    });
  });
});
