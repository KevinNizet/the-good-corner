import { Arg, ID, Mutation, Query, Resolver, Int, Ctx, Authorized, AuthenticationError } from "type-graphql";
import { Ad, AdCreateInput, AdUpdateInput, AdsWhere } from "../../entities/Ad";
import { validate } from "class-validator";
import { In, Like, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { ContextType } from "../../auth";
import { merge } from "../../utils2";

@Resolver(Ad)
export class AdsResolver {
  //décorateur appellant le middleware auth.ts pour valider l'authentification et l'accés aux Ads
  @Authorized()
  @Query(() => [Ad])
  async allAds(
    @Arg("where", { nullable: true }) where?: AdsWhere,
    @Arg("take", () => Int, { nullable: true }) take?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<Ad[]> {



    const queryWhere: any = {};

    if (where?.categoryIn) {
      queryWhere.category = { id: In(where.categoryIn) };
    }

    if (where?.tagIn) {
      queryWhere.tags = { id: In(where.tagIn) };
    }

    if (where?.searchTitle) {
      queryWhere.title = Like(`%${where.searchTitle}%`);
    }

    if (where?.priceGte) {
      queryWhere.price = MoreThanOrEqual(Number(where.priceGte));
    }

    if (where?.priceLte) {
      queryWhere.price = LessThanOrEqual(Number(where.priceLte));
    }

     const ads = await Ad.find({
      take: take ?? 50,
      skip,
      where: queryWhere,
      //order,
      relations: {
        category: true,
        tags: true,
      },
    });
    return ads;
  }

  @Query(() => Int)
  async allAdsCount(
    @Arg("where", { nullable: true }) where?: AdsWhere
  ): Promise<number> {
    const queryWhere: any = {};

    if (where?.categoryIn) {
      queryWhere.category = { id: In(where.categoryIn) };
    }

    if (where?.searchTitle) {
      queryWhere.title = Like(`%${where.searchTitle}%`);
    }

    if (where?.priceGte) {
      queryWhere.price = MoreThanOrEqual(Number(where.priceGte));
    }

    if (where?.priceLte) {
      queryWhere.price = LessThanOrEqual(Number(where.priceLte));
    }

    const count = await Ad.count({
      where: queryWhere,
    });
    return count;
  }

  @Authorized()
  @Query(() => Ad, { nullable: true })
  async ad(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { category: true, tags: true },
    });
    return ad;
  }

  @Authorized()
  @Mutation(() => Ad)
  async createAd(
    @Ctx() context: ContextType,
    @Arg("data", () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data, {
      createdBy: context.user,
    });

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      return newAd;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Authorized()
  @Mutation(() => Ad, { nullable: true })
  async updateAd(
    @Ctx() context: ContextType,
    @Arg("id", () => ID) id: number,
    @Arg("data") data: AdUpdateInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { tags: true, createdBy: true },
    });


    if (ad && ad.createdBy.id === context.user?.id) {
      merge(ad, data)

  /*     // we should keep existing relations
       if (data.tags) {
        data.tags = data.tags.map((entry) => {
          const existingRelation = ad.tags.find(
            (tag) => tag.id === Number(entry.id)
          );
          return existingRelation || entry;
        });
      } */

      Object.assign(ad, data); 

      const errors = await validate(ad);
      if (errors.length === 0) {
        await Ad.save(ad);
        return await Ad.findOne({
          where: { id: id },
          relations: {
            category: true,
            tags: true,
          },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    } else {
      return null
    }
  }

  @Authorized()
  @Mutation(() => Ad, { nullable: true })
  async deleteAd(
    @Ctx() context: ContextType,
    @Arg("id", () => ID) id: number): Promise<Ad | null> {
// Check if the user is authenticated and verified

const ad = await Ad.findOne({
  where: { id: id },
});

if (ad) {
  // Check if the user is the creator of the ad
  if (ad.createdBy.id === context.user?.id) {
    await ad.remove();
    ad.id = id;
  } else {
    throw new AuthenticationError("User is not the creator of the ad.");
  }
}

return ad;
}
}