import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  description: "Gets Artist",
  fields: () => ({
    ArtistId: {
      type: GraphQLString,
      description: "The id of the artist.",
    },
    Name: {
      type: GraphQLString,
      description: "The name of the artist.",
    },
  }),
});

const AlbumType = new GraphQLObjectType({
  name: "Album",
  description: "Gets Artist",
  fields: () => ({
    AlbumId: {
      type: GraphQLString,
      description: "The id of the album.",
    },
    Title: {
      type: GraphQLString,
      description: "The title of the album.",
    },
    ArtistId: {
      type: GraphQLString,
      description: "The artist Id of Album.",
    },
  }),
});

const ArtistInputType = new GraphQLInputObjectType({
  name: "ArtistInputType",
  description: "Helsinki's location with lat and long",
  fields: () => ({
    ArtistId: {
      type: GraphQLString,
      description: "The id of the artist.",
    },
    Name: {
      type: GraphQLString,
      description: "The name of the artist.",
    },
  }),
});
const ArtistLogType = new GraphQLObjectType({
  name: "ArtistLog",
  description: "Gets Artist Log",
  fields: () => ({
    ArtistLogId: {
      type: GraphQLInt,
      description: "The id of the artist log.",
    },
    OperationType: {
      type: GraphQLString,
      description: "The operation type of the artist log.",
    },
    ArtistId: {
      type: GraphQLInt,
      description: "The ArtisId of the artist log.",
    },
    Name: {
      type: GraphQLString,
      description: "The Artis Name of the artist log.",
    },
  }),
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve: async (_root, _args, ctx) => {
          const { hello } = await ctx.db.get(`SELECT 'world' AS hello`);
          return hello;
        },
      },
      /****************************************
* How to use      
query{
  getAllArtists{
    ArtistId,
    Name
  }
}
*****************************************/
      getAllArtists: {
        type: new GraphQLList(ArtistType),
        resolve: async (_root, _args, ctx) => {
          const sql = ` SELECT ArtistId, Name FROM artists `;
          const result = await ctx.db.all(sql);
          return result;
        },
      },
      /*****************************************
* How to use      
query{
  getAlbumByArtistId(artistId:2){
    AlbumId,
    Title,
    ArtistId
  }
}
*****************************************/
      getAlbumByArtistId: {
        type: new GraphQLList(AlbumType),
        args: {
          artistId: {
            description: "id of the Artist",
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve: async (_root, _args, ctx) => {
          const sql = ` SELECT AlbumId, title, ArtistId FROM albums WHERE ArtistId=?`;
          const artistId = _args.artistId;
          const result = await ctx.db.all(sql, artistId);
          return result;
        },
      },
    }),
  }),

  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      /************************************************ 
* How to use      
mutation{
  updateArtist( artists:{ ArtistId:"1", Name:"YY" } ){
    ArtistId,
    Name
  }
}
*************************************************/
      updateArtist: {
        type: ArtistType,
        args: {
          artists: {
            description: "Artist parameters for update",
            type: ArtistInputType,
          },
        },
        resolve: async (_root, _args, ctx) => {
          const name = _args.artists.Name;
          const artistId = _args.artists.ArtistId;
          const updateSql = `UPDATE artists SET Name = ? WHERE ArtistId = ? `;
          if (await ctx.db.run(updateSql, [name, artistId])) {
            const sql = ` SELECT ArtistId, Name FROM artists WHERE ArtistId = ?`;
            const result = await ctx.db.get(sql, [artistId]);
            return result;
          }
          return null;
        },
      },
    }),
  }),

  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: () => ({
      /************************************************ 
* How to use      
subscription{
	subscribeArtist{
    ArtistLogId,
    OperationType,
    ArtistId,
    Name
  }
}
*************************************************/      
      subscribeArtist: {
        type: new GraphQLList(ArtistLogType),
        subscribe: async function* (_root, _args, ctx) {
          let timeOutId = null;
          while (true) {
            if (timeOutId) {
              clearTimeout(timeOutId);
            }
            try{
              const sql = `SELECT ArtistLogId, OperationType, ArtistId, Name FROM ArtistLog`;
              let subscribeArtist = await ctx.db.all(sql);
  
              const deleteSql = `DELETE FROM ArtistLog`;
              await ctx.db.run(deleteSql);
              yield { subscribeArtist };
            }catch(e){
              // here you can catch all the exceptions
              console.log( e );
           } finally {
           }
   
            //sleep for 5 seconds.
            await new Promise((resolve) => {
              timeOutId = setTimeout(resolve, 10000);
            });
          }
        },
      },
    }),
  }),
});
