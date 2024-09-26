import { Router, Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';

const router = Router();

// Initialize Firestore using dependency injection
const crudRoutes = (db: Firestore) => {
  /**
   * @swagger
   * /api/create:
   *   post:
   *     summary: Create a new document
   *     tags: [CRUD]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               collection:
   *                 type: string
   *                 example: users
   *               data:
   *                 type: object
   *                 example: { "name": "John", "age": 30 }
   *     responses:
   *       201:
   *         description: Document created
   *       500:
   *         description: Error creating document
   */
  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { collection, data } = req.body;
      const docRef = await db.collection(collection).add(data);
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error creating document');
    }
  });

  /**
   * @swagger
   * /api/read/{collection}/{id}:
   *   get:
   *     summary: Get a document by ID
   *     tags: [CRUD]
   *     parameters:
   *       - in: path
   *         name: collection
   *         schema:
   *           type: string
   *         required: true
   *         description: Collection name
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Document ID
   *     responses:
   *       200:
   *         description: Document retrieved
   *       404:
   *         description: Document not found
   *       500:
   *         description: Error reading document
   */
  router.get('/read/:collection/:id', async (req: Request, res: Response) => {
    try {
      const { collection, id } = req.params;
      const doc = await db.collection(collection).doc(id).get();
      if (!doc.exists) {
        return res.status(404).send('Document not found');
      }
      res.status(200).json(doc.data());
    } catch (error) {
      console.log(error);
      res.status(500).send('Error reading document');
    }
  });

  /**
   * @swagger
   * /api/update/{collection}/{id}:
   *   put:
   *     summary: Update a document by ID
   *     tags: [CRUD]
   *     parameters:
   *       - in: path
   *         name: collection
   *         schema:
   *           type: string
   *         required: true
   *         description: Collection name
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Document ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *                 example: { "name": "John", "age": 31 }
   *     responses:
   *       200:
   *         description: Document updated
   *       500:
   *         description: Error updating document
   */
  router.put('/update/:collection/:id', async (req: Request, res: Response) => {
    try {
      const { collection, id } = req.params;
      const { data } = req.body;
      const docRef = db.collection(collection).doc(id);
      await docRef.update(data);
      res.status(200).send('Document updated');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error updating document');
    }
  });

  /**
   * @swagger
   * /api/delete/{collection}/{id}:
   *   delete:
   *     summary: Delete a document by ID
   *     tags: [CRUD]
   *     parameters:
   *       - in: path
   *         name: collection
   *         schema:
   *           type: string
   *         required: true
   *         description: Collection name
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Document ID
   *     responses:
   *       200:
   *         description: Document deleted
   *       500:
   *         description: Error deleting document
   */
  router.delete(
    '/delete/:collection/:id',
    async (req: Request, res: Response) => {
      try {
        const { collection, id } = req.params;
        await db.collection(collection).doc(id).delete();
        res.status(200).send('Document deleted');
      } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting document');
      }
    }
  );

  return router;
};

export default crudRoutes;
