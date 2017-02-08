Imagine you just graduated from your Ironhack course and because on how outstanding your performance was,
the boss G.M. decides to offer you to join the I.B.I.

That´s it, the Ironhack Bureau Investigation. Then you can think of yourself doing a lot of cool stuff, hacking the bad guys and making this plante a safer place to live. But on your first day, G.M. comes to see you with bad news: Hey Ironhacker! Last night we´ve been hacked and all our system is down. There´s a lot of stuff to fix but I know I can trust you to solve this situation.
First thing first, the boss lost his access over the platform and he needs to take control again to give access to his employees.

First Iteration:
  Rebuild all the platform and make the SuperUser to be able to create more "participants". The routes must be protected so only logged users can access it. For the moment foreign users can´t access it, only the superuser can create access.
  Make a schema with different roles: "Boss", "Developer", "TA".

Second Iteration:

  The SuperUser must be able also to delete employees from the database. This action is reserved to him and only to him. Users can also edit their profile.

  Third Iteration:
    Now that our platform is 100% operative, it´s time to let some new people come in.
    Add a functionality so new alumni can access the platform login with the Social Network of your choice. Every new alumni should be stored in the database with "student" role.
    Alumni can see their profile and the operative courses but they should not be able to see any of the "management" platform.
