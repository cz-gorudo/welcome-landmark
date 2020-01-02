import { postgres } from "./postgres";
import { CreateNoteArgs, EditNoteArgs, Note, PgNote } from "./typings";
import status from "http-status-codes";

async function exists(id: number) : Promise<boolean> {
    const {rows: [row]} = await postgres.exec<{noteCount?: string}>({
        statement: `
            select count(*) as "noteCount" from notes
            where note_id = $1::integer
            limit 1;
        `,
        params: [id]
    });
    return !!(row && row.noteCount && parseInt(row.noteCount) > 0);
}

async function insertNote(args: CreateNoteArgs) : Promise<Note> {
    const { text, author, lat, lng, username } = args;
    const {rows: [_new], rowCount} = await postgres.exec<PgNote>({
        statement: `
            insert into notes (text, lat, lng, author) values ($1::text, $2::numeric, $3::numeric, $4::integer)
            returning text, lat, lng, note_id as "noteId";
        `,
        params: [text, lat, lng, author]
    });

    if (!rowCount) {
        const error : any = new Error(`Something went wrong, row is not created in DB.`);
        error.status = status.INTERNAL_SERVER_ERROR;
        throw error;
    }
    return { ..._new, username };
}


async function getNote(id: number) : Promise<Note> {
    const {rows: [note], rowCount} = await postgres.exec<Note>({
        statement: `
            select nt.text, nt.lat, nt.lng, usr.username, nt.note_id as "noteId" from notes nt
            where nt.deleted != true
            inner join users usr on usr.user_id = nt.author
            limit 1;
        `,
        params: [id]
    });
    if (!rowCount) {
        const error : any = new Error(`Note with id ${id} is missing in DB.`);
        error.status = status.NOT_FOUND;
        throw error;
    }
    return note;
}

async function getNotes() : Promise<{notes: Note[], count: number}> {
    const {rows: notes, rowCount: count} = await postgres.exec<Note>({
        statement: `
            select nt.text, nt.lat, nt.lng, usr.username, nt.note_id as "noteId" from notes nt
            where nt.deleted != true
            inner join users usr on usr.user_id = nt.author;
        `
    });
    return { notes, count };
}

async function deleteNote(id: number, username: string) : Promise<Note> {
    if (!exists(id)) {
        const error: any = new Error(`Note with id ${id} is missing in DB.`);
        error.status = status.NOT_FOUND;
        throw error;
    }
    const {rows: [deleted]} = await postgres.exec<Note>({
        statement: `
            update notes (deleted, deleted_at) set (true::boolean, now()::timestamp)
            where note_id = $1::integer
            returning text, lat, lng, note_id as "noteId"
        `,
        params: [id]
    });
    return { ...deleted, username };
}

export {
    deleteNote,
    getNote,
    getNotes,
    insertNote,
    exists
};