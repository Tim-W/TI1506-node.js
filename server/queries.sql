SELECT COUNT(*) FROM ToDoItem;

SELECT COUNT(*) FROM ToDoList;

SELECT COUNT(*) FROM ToDoList GROUP BY Owner;

SELECT AVG(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) FROM ToDoItem WHERE Completed = 1;

SELECT MIN(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) FROM ToDoItem WHERE Completed = 1;

SELECT MAX(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) FROM ToDoItem WHERE Completed = 1;

SELECT *, TIMESTAMPDIFF(MINUTE, NOW(), DueDate) as timeDiff FROM ToDoItem  WHERE Completed = 0 GROUP BY timeDiff HAVING MIN(timeDiff) AND timeDiff >=0;

SELECT SUM(CASE WHEN ToDoItem.Completed >= 1 THEN 1 ELSE 0 END) as Completed, SUM(CASE WHEN Completed = 0 THEN 1 ELSE 0 END) as notCompleted FROM ToDoItem;

SELECT SUM(CASE WHEN Priority >= 1 THEN 1 ELSE 0 END) as priority, SUM(CASE WHEN Priority = 0 THEN 1 ELSE 0 END) as notPriority FROM ToDoItem;

SELECT ToDoListID, AVG(TIMESTAMPDIFF(MINUTE, CreationDate, CompletionDate)) FROM ToDoItem WHERE Completed = 1 GROUP BY ToDoListID;

