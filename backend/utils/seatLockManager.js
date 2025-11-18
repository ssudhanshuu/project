let lockedSeats = {}; 
// structure: { "showId_time": ["A1","A2"] }

function lockSeats(showId, time, seats, userId) {
  const key = `${showId}_${time}`;
  if (!lockedSeats[key]) lockedSeats[key] = [];

  // check conflicts
  for (const seat of seats) {
    if (lockedSeats[key].includes(seat)) {
      throw new Error(`Seat ${seat} already locked`);
    }
  }

  // lock them
  lockedSeats[key].push(...seats);

  // auto release after 5 minutes
  setTimeout(() => {
    lockedSeats[key] = lockedSeats[key].filter(s => !seats.includes(s));
  }, 5 * 60 * 1000);
}

function getLockedSeats(showId, time) {
  return lockedSeats[`${showId}_${time}`] || [];
}

module.exports = { lockSeats, getLockedSeats };
