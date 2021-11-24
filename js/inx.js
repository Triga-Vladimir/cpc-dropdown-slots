"use strict";
//1 in 81 chance to get any valid option, 1 in 729 to get a particular option
//16 in 81 chance to get only 2 in a row, 17 in 81 to get at least 2 in a row, 8 in 27 to get just 2 matching
//56 in 81 all different
//The tweet video was definitely faked, but can be seen winning here
//https://twitter.com/Osorpenke/status/1445191696715821058
let enabled = true;
const items = 9;
const wheels = [1, 2, 3].map((x) => document.querySelector(`#dropdown .dropdown .wheel${x}`));
const tag = document.querySelector(`#dropdown .tag`);
const dropdown = document.querySelector(`#dropdown .dropdown`);
const dropdown_wrapper = document.getElementById(`dropdown`);
const all_equal = ([head, ...tail] = []) => tail.every((x) => x == head);
const round_and_modulus_numbers = (numbers, mod) => numbers.map((x) => Math.round(x) % items);
const minimum_spins = 3;
const state_increment = (current, index) => (minimum_spins + Math.random()) * items //minimum spins with 0-1 extra
    * ((index + 2) / 3)
    //Increases spins for wheels that also take longer spinning
    + current;
const row_height = 60; //Each row is 48 pixels with 12 pixel transition
const background_position_value = (position) => Math.round(position) * row_height;
const background_position = (position) => `${background_position_value(position)}px`;
const before_every_spin = () => {
    dropdown.classList.add(`show-gap`);
    dropdown_wrapper.classList.remove(`valid`);
    tag.classList.add(`disabled`);
};
const after_every_spin = (fn = () => { }) => {
    fn();
    tag.classList.remove(`disabled`);
    enabled = true;
};
const run_after_spinning = (fn) => setTimeout(() => after_every_spin(fn), 5000);
const run_after_shaking = (fn) => setTimeout(fn, 500);
const spin = (state) => {
    before_every_spin();
    const next_state = state.map(state_increment);
    wheels.forEach((el, i) => {
        el.style.backgroundPositionY =
            background_position(next_state[i]);
    });
    if (all_equal(round_and_modulus_numbers(next_state, items))) {
        run_after_spinning(() => {
            dropdown.classList.remove(`show-gap`);
            dropdown_wrapper.classList.add(`valid`);
        });
    }
    else {
        run_after_spinning(() => {
            dropdown_wrapper.classList.add(`shake`);
            run_after_shaking(() => {
                dropdown_wrapper.classList.remove(`shake`);
            });
        });
    }
    return next_state;
};
let state = [0, 0, 0];
tag.addEventListener(`click`, () => {
    if (!enabled)
        return;
    enabled = false;
    state = spin(state);
});