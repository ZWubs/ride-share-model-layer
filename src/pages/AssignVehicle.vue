<template>
	<v-container>
		<div>
			<h4>Assign a Vehicle to a Ride</h4>

			<instructions details="Update which vehicle is assigned to which ride."/>

			<v-select
			v-model="thisRide.id"
			:items="idList"
			item-text="text"
			item-value="value"
			label="Ride ID"
			v-bind:rules="rules.required">
			</v-select>
		</div>
	</v-container>
</template>