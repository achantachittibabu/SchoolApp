// Mock TimeTable Data
export const mockTimeTables = [
  {
    id: '1',
    type: 'student',
    class: 'Class 10-A',
    morning: {
      from: '09:00',
      to: '12:00',
      periods: [
        { id: '1', name: 'Period 1', from: '09:00', to: '09:45', subject: 'Mathematics' },
        { id: '2', name: 'Period 2', from: '09:45', to: '10:30', subject: 'English' },
        { id: '3', name: 'Period 3', from: '10:45', to: '11:30', subject: 'Science' },
      ],
    },
    lunch: {
      from: '12:00',
      to: '12:45',
    },
    afternoon: {
      from: '12:45',
      to: '15:30',
      periods: [
        { id: '4', name: 'Period 4', from: '12:45', to: '13:30', subject: 'History' },
        { id: '5', name: 'Period 5', from: '13:30', to: '14:15', subject: 'Geography' },
      ],
    },
  },
  {
    id: '2',
    type: 'teacher',
    class: null,
    morning: {
      from: '08:30',
      to: '12:00',
      periods: [
        { id: '1', name: 'Period 1', from: '08:30', to: '09:15', subject: 'Mathematics' },
        { id: '2', name: 'Period 2', from: '09:15', to: '10:00', subject: 'Mathematics' },
      ],
    },
    lunch: {
      from: '12:00',
      to: '12:45',
    },
    afternoon: {
      from: '12:45',
      to: '15:00',
      periods: [
        { id: '3', name: 'Period 3', from: '12:45', to: '13:30', subject: 'Mathematics' },
      ],
    },
  },
];
