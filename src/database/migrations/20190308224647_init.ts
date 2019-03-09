import * as Knex from "knex";

import {
  TABLE_NAME_GAME,
  TABLE_NAME_GROUP,
  TABLE_NAME_GROUP_USER,
  TABLE_NAME_PLAYER,
  TABLE_NAME_USER,
} from '../config';

const tableNames = [
  TABLE_NAME_GAME,
  TABLE_NAME_GROUP,
  TABLE_NAME_GROUP_USER,
  TABLE_NAME_PLAYER,
  TABLE_NAME_USER,
];

export async function up(knex: Knex): Promise<any> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
  .then(() => {
    return knex.raw(`
      CREATE FUNCTION update_updated_at_column()
          RETURNS trigger
        LANGUAGE plpgsql
        AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$;
  `);
  })
  .then(() => {
    return Promise.all([
      knex.schema.createTable(TABLE_NAME_USER, (t) => {
        t.string('id').primary().notNullable();
        t.string('auth0_id').notNullable();
        t.string('first_name').notNullable();
        t.string('last_name').notNullable();
        t.string('email').notNullable();
        t.boolean('is_admin').defaultTo(false).notNullable();

        t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
        t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
      }),

      knex.schema.createTable(TABLE_NAME_GROUP, (t) => {
        t.string('id').primary().notNullable();
        t.string('name');
        t.string('description');

        t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
        t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
      }),

      knex.schema.createTable(TABLE_NAME_GROUP_USER, (t) => {
        t.string('user_id')
          .references('id').inTable(TABLE_NAME_USER)
          .onUpdate('CASCADE').onDelete('CASCADE');

        t.string('group_id')
          .references('id').inTable(TABLE_NAME_GROUP)
          .onUpdate('CASCADE').onDelete('CASCADE');

        t.boolean('is_admin').defaultTo(false).notNullable();

        t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
        t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
      }),

      knex.schema.createTable(TABLE_NAME_GAME, (t) => {
        t.string('id').primary().notNullable();
        t.dateTime('date');
        t.string('name');
        t.jsonb('structure');
        t.string('type').notNullable();
        t.integer('state').notNullable().defaultTo(100);

        t.string('group_id')
          .references('id').inTable(TABLE_NAME_GROUP)
          .onUpdate('CASCADE').onDelete('CASCADE');

        t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
        t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
      }),

      knex.schema.createTable(TABLE_NAME_PLAYER, (t) => {
        t.string('id').notNullable().primary();

        t.string('user_id')
        .references('id').inTable(TABLE_NAME_USER)
        .onUpdate('CASCADE').onDelete('CASCADE');

        t.string('game_id')
          .references('id').inTable(TABLE_NAME_GAME)
          .onUpdate('CASCADE').onDelete('CASCADE');

        t.float('buy_in');
        t.float('final_chip_count');
        t.float('max_chips');
        t.float('min_chips');

        t.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
        t.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
      }),
    ]);
  })
  .then(() => {
    return Promise.all(tableNames.map(tn => knex.raw(`
      CREATE TRIGGER ${tn}_update_updated_at
      BEFORE UPDATE ON ${tn}
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `)))
  });
};


export async function down(knex: Knex): Promise<any> {
  return Promise.all(tableNames.map(tn => knex.raw(`DROP TABLE ${tn} CASCADE`)))
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE'))
    .then(() => knex.raw('DROP EXTENSION "pgcrypto"'));
};

