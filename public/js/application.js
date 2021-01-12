const newPlan = document.querySelector('#hiddenPlan');

document.addEventListener('click', async (event) => {
  if (event.target.id === 'deleteStud') {
    const articleID = event.target.closest('article').id;
    const response = await fetch('/student/deleteStudent', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleID }),
    });
    if (response.status === 200) {
      const deletePost = event.target.closest('article');
      deletePost.style.display = 'none';
      window.location.reload();
    }
  }
  if (event.target.id === 'deletePlan') {
    const articleID = event.target.closest('article').id;
    const response = await fetch('/student/deletePlan', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleID }),
    });
    if (response.status === 200) {
      const deletePost = event.target.closest('article');
      deletePost.style.display = 'none';
      window.location.reload();
    }
  }

  // if (event.target.id === 'planForLesson') {
  //   const articleID = event.target.closest('article').id;
  //   console.log(articleID);
  //   const response = await fetch('/student/update', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ articleID }),
  //   });
  // if (response.status === 200) {
  //   const deletePost = event.target.closest('article');
  //   deletePost.style.display = 'none';
  //   window.location.reload();
  // }
});
