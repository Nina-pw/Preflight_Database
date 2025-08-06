import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client.js";
import { todoTable, userTable } from "@db/schema.js";

// ใช้ email จำลองเพื่อดึง user มาผูกกับ ToDo
const TEST_USER_EMAIL = "test@example.com";

async function getTestUserId() {
  const users = await dbClient.select().from(userTable).where(eq(userTable.email, TEST_USER_EMAIL));
  if (users.length === 0) {
    throw new Error(`User with email ${TEST_USER_EMAIL} not found`);
  }
  return users[0].id;
}

async function insertData() {
  const userId = await getTestUserId();

  await dbClient.insert(todoTable).values({
    title: "Finish reading",
    description: "Read all chapters in the book",
    userId,
  });

  dbConn.end();
}

async function queryData() {
  const userId = await getTestUserId();

  const results = await dbClient.query.todoTable.findMany({
    where: (todo, { eq }) => eq(todo.userId, userId),
  });

  console.log(results);
  dbConn.end();
}

async function updateData() {
  const userId = await getTestUserId();

  const results = await dbClient.query.todoTable.findMany({
    where: (todo, { eq }) => eq(todo.userId, userId),
  });

  if (results.length === 0) return dbConn.end();

  const id = results[0].id;

  await dbClient
    .update(todoTable)
    .set({ title: "Updated title", description: "Updated description" })
    .where(eq(todoTable.id, id));

  dbConn.end();
}

async function deleteData() {
  const userId = await getTestUserId();

  const results = await dbClient.query.todoTable.findMany({
    where: (todo, { eq }) => eq(todo.userId, userId),
  });

  if (results.length === 0) return dbConn.end();

  const id = results[0].id;

  await dbClient.delete(todoTable).where(eq(todoTable.id, id));
  dbConn.end();
}

// ปิดหรือเปิดอันที่ต้องการ
// await insertData();
await queryData();
// await updateData();
// await deleteData();
