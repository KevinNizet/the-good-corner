import { Controller } from ".";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";

export class CategoriesController implements Controller {
  async getAll(req: Request, res: Response) {
    Category.find()
      .then((categories) => {
        res.send(categories);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send();
      });
  }

  async getOne(req: Request, res: Response) {
    try {
      const ad = await Category.findOne({
        where: { id: Number(req.params.id) },
      });
      res.send(ad);
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }

  async createOne(req: Request, res: Response) {
    try {
      const newCategory = new Category();
      newCategory.name = req.body.name;

      const errors = await validate(newCategory);
      if (errors.length === 0) {
        await newCategory.save();
        res.send(newCategory);
      } else {
        res.status(400).json({ errors: errors });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const ad = await Category.findOne({
        where: { id: Number(req.params.id) },
      });
      if (ad) {
        await ad.remove();
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    } catch (err: any) {
      // typeguards
      console.error(err);
      res.status(500).send();
    }
  }

  async patchOne(req: Request, res: Response) {
    try {
      const ad = await Category.findOne({
        where: { id: Number(req.params.id) },
      });

      if (ad) {
        Object.assign(ad, req.body, { id: ad.id });
        const errors = await validate(ad);
        if (errors.length === 0) {
          await ad.save();
          res.status(204).send();
        } else {
          res.status(400).json({ errors: errors });
        }
      } else {
        res.status(404).send();
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }

  async updateOne(req: Request, res: Response) {
    try {
      const ad = await Category.findOne({
        where: { id: Number(req.params.id) },
      });

      if (ad) {
        // should be tested again
        const newAd = Object.assign(req.body, { id: ad.id });
        const errors = await validate(newAd);
        if (errors.length === 0) {
          await Category.save(newAd);
          res.status(204).send();
        } else {
          res.status(400).json({ errors: errors });
        }
      }

      res.status(204).send();
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }
}
