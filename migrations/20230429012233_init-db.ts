import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.string('id').primary();

        table.string('email').unique();
        table.string('password').notNullable();

        table.string('lastName').notNullable();
        table.string('firstName').notNullable();
        table.string('image');
        table.binary('pdf');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}
