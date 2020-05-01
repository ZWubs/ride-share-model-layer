CREATE TABLE driver(
    id serial not null constraint driver_pk primary key,
    firstName varchar not null,
    lastName varchar not null,
    phone varchar not null,
    licenseNumber varchar not null
);

CREATE TABLE passenger(
    id serial not null constraint passenger_pk primary key,
    firstName varchar not null,
    lastName varchar not null,
    phone varchar not null
);

CREATE TABLE vehicleType(
    id serial not null constraint vehicleType_pk primary key,
    type varchar not null
);

CREATE TABLE vehicle(
    id serial not null constraint vehicle_pk primary key,
    make varchar not null,
    model varchar not null,
    color varchar not null,
    vehicleTypeId integer not null REFERENCES vehicleType(id),
    capacity integer not null,
    mpg float not null,
    licenseState varchar not null,
    licenseNumber varchar not null
);

CREATE TABLE state(
    abbreviation varchar not null constraint state_pk primary key,
    name varchar
);

CREATE TABLE location(
    id serial not null constraint location_pk primary key,
    name varchar not null,
    address varchar not null,
    city varchar not null,
    state varchar not null REFERENCES state(abbreviation),
    zipCode varchar not null
);

CREATE TABLE ride(
    id serial not null constraint ride_pk primary key,
    date date not null,
    time time not null,
    distance float not null,
    fuelPrice float not null,
    fee float not null,
    vehicleId integer not null REFERENCES vehicle(id),
    fromLocationId integer not null REFERENCES location(id),
    toLocationId integer not null REFERENCES location(id)
);



INSERT INTO driver (firstName, lastName, phone, licenseNumber)
VALUES ('Fred', 'Ziffle', '985-673-6738', 'asdfjkl;123');

INSERT INTO passenger(firstName, lastName, phone)
VALUES ('Bob','Brown', '890-234-1789');

INSERT INTO state(abbreviation, name) VALUES ('IN','Indiana');

INSERT INTO vehicleType(type) VALUES ('car');

INSERT INTO vehicle(make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES ('Honda', 'CR-V', 'blue',1, 5, 30, 'OH', '3A78h23');

INSERT INTO location (name, address, city, state, zipCode)
VALUES ('Taylor University', '236 W Reade Ave', 'Upland', 'IN', '46989');

INSERT INTO location (name, address, city, state, zipCode)
VALUES ('Indianapolis Airport', '7800 Col. H. Weir Cook Memorial Dr', 'Indianapolis', 'IN', '46241');

INSERT INTO ride (date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES ('2020-12-13', '05:00', 90.7, 10, 12.00, 1, 2, 4);

