import t from "ava";

// POST /api/auth
t.todo('client get 422 is schema is invalid');
t.todo('user get 401 if wrong token');
t.todo('existing user is authenticated');

// POST /api/notes
t.todo('client get 422 if schema is invalid');
t.todo('client get 401 if without token');
t.todo('client can not leave a note on same lat/lng');
t.todo('client creates a new note');

// PUT /api/notes/:id
t.todo('client get 422 if schema is invalid');
t.todo('client get 401 if without token');

// DELETE /api/notes/:id
t.todo('client get 422 if schema is invalid');
t.todo('client get 401 if without token');
t.todo('can delete only own notes');

// GET /api/notes
t.todo('empty response if no notes');
t.todo('return notes');

// GET /api/notes/:id
t.todo('client get 422 if schema is invalid');
t.todo('return 404 if no note is found');
t.todo('return note by id');