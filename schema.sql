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
    date varchar not null,
    time time not null,
    distance float not null,
    fuelPrice float not null,
    fee float not null,
    vehicleId integer not null REFERENCES vehicle(id),
    fromLocationId integer not null REFERENCES location(id),
    toLocationId integer not null REFERENCES location(id)
);


CREATE TABLE authorizations(
    driverId integer REFERENCES driver(id),
    vehicleId integer REFERENCES vehicle(id)
);

create table drivers
(
    driverid integer not null constraint drivers_driver_id_fk references driver,
    rideid   integer not null constraint drivers_ride_id_fk references ride,
    constraint drivers_pk primary key (driverid, rideid)
);

CREATE TABLE passengers(
    passengerid integer not null REFERENCES passenger(id),
    rideid integer not null references ride(id),
    constraint passengers_pk primary key (passengerid, rideid)
);

