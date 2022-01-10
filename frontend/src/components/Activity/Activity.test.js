import { render, /* fireEvent, **/ screen } from '@testing-library/react';
import UserContext from '../../contexts/UserContext';
import Activity from './Activity';

const testActivity = {
  description: 'test activity name',
  date: '2022-01-01',
  time: '1:00',
  miles: 18.5,
  calories: 600,
  id: '1',
}
function renderActivity(activity) {
  return render(
    <UserContext.Provider
      value={{
        currentUser: "testUser",
        currentToken: "testToken",
      }}
    >
      <Activity activity={activity}/>
    </UserContext.Provider>
  );
}

it('renders without crashing', () =>{
  renderActivity(testActivity);
});

it('renders with correct user greeting', ()=> {
  renderActivity(testActivity);
  expect(
    screen.getByText(`${testActivity.description}: ${testActivity.date}`)
  ).toBeInTheDocument();
})