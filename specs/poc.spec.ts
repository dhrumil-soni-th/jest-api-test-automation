import * as supertest from "supertest";

const request = supertest("https://jsonplaceholder.typicode.com");
describe("POC Tests", () => {
  describe("GET Requests", () => {
    it("GET /posts", async () => {
      const response = await request.get("/posts");
      // console.log(response);
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].userId).toBe(1);
    });

    it("GET /comments with query params", async () => {
      // 1st way to use query params
      // const response = await request.get("/comments?postId=1");

      // 2nd way to use query params
      const response = await request
        .get("/comments")
        .query({ postId: 1, limit: 10 });
      console.log(response);
      expect(response.body[0].postId).toBe(1);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST Request", () => {
    it("POST /posts", async () => {
      const data = {
        title: "Automation Testing with Supertest",
        body: "This is a sample post created for testing purposes.",
        userId: 1,
      };
      const response = await request.post("/posts").send(data);
      console.log(response.body);
      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe(data.title);
    });
  });

  describe("PUT Request", () => {
    // Note: PUT is used to update an existing resource
    // PUT request typically sends the entire request body
    it("PUT /posts/{id}", async () => {
      const data = {
        title: "Updated Post Title",
        body: "This post has been updated.",
        userId: 1,
      };
      const getResponse = await request.get("/posts/1");
      const beforeTitle = getResponse.body.title;
      console.log(beforeTitle);

      const response = await request.put("/posts/1").send(data);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.title).not.toBe(beforeTitle);
      expect(response.body.title).toBe(data.title);
    });
  });

  describe("PATCH Request", () => {
    // Note: PATCH is used to partially update an existing resource
    // PATCH request typically sends only the fields that need to be updated
    it("PATCH /posts/{id}", async () => {
      const data = {
        title: "Partially Updated Post Title",
      };
      const getResponse = await request.get("/posts/1");
      const beforeTitle = getResponse.body.title;
      console.log(beforeTitle);

      const response = await request.patch("/posts/1").send(data);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.title).not.toBe(beforeTitle);
      expect(response.body.title).toBe(data.title);
    });
  });

  describe("DELETE Request", () => {
    // Note: DELETE is used to remove an existing resource
    it.only("DELETE /posts/{id}", async () => {
      const response = await request.delete("/posts/1");
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({});
    });
  });
});
