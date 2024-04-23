import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export interface burritoListInterface extends RowDataPacket {
  id: number;
  name: string;
  size: string;
  price: number;
}

export async function getBurritoList() {
  const [rows, packet] = await pool.query<burritoListInterface[]>(
    "SELECT * FROM burritoList"
  );
  return rows;
}

export interface orderInterface extends RowDataPacket {
  id: number;
  total: number;
}

export async function getOrders() {
  const [rows, packet] = await pool.query<orderInterface[]>(`
  SELECT order_id, SUM(oi.count * bl.price) AS total
  FROM orderItems oi
  JOIN burritoList bl ON oi.burrito_id = bl.id
  WHERE order_id in (SELECT id FROM orders)
  GROUP BY order_id
`);
  return rows;
}

export interface orderItemInterface extends RowDataPacket {
  burrito_id: number;
  order_id: number;
  count: number;
}

export interface orderItemDataInterface {
  burrito_id: number;
  count: number;
}

export async function getOrderDetail(id: number) {
  const [rows, packet] = await pool.query<orderItemInterface[]>(
    `
    SELECT bl.name, bl.size, bl.price, oi.count
    FROM orderItems  oi
    JOIN burritoList bl ON oi.burrito_id = bl.id
    WHERE oi.order_id = ?`,
    [id]
  );
  return rows;
}

const insertOrderItemQuery = `
INSERT INTO orderItems (burrito_id, order_id, count)
VALUES
(?,?,?);
`;

export async function createNewOrder(data: orderItemDataInterface[]) {
  const [result] = await pool.query<ResultSetHeader>(`
  INSERT INTO orders ()
  VALUES
  ();`);

  for (let i = 0; i < data.length; i++) {
    const attributes = [data[i].burrito_id, result.insertId, data[i].count];
    await pool.query(insertOrderItemQuery, attributes);
  }
  return result;
}
