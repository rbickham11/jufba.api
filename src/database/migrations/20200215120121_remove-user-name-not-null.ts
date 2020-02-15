import * as Knex from "knex";

import {
  TABLE_NAME_USER,
} from '../config';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable(TABLE_NAME_USER, t => {
    t.string('first_name').nullable().alter();
    t.string('last_name').nullable().alter();
  });
};


export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable(TABLE_NAME_USER, t => {
    t.string('first_name').notNullable().alter();
    t.string('last_name').notNullable().alter();
  });
};

