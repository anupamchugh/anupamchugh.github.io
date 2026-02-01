---
title: 'MLDataTable: The Panda For iOS Developers'
description: "Leverage the powerful Create ML Data structure to ignite the data scientist in\_you"
date: '2019-11-22T21:50:50.395Z'
categories: []
keywords: []
slug: /@anupamchugh/mldatatable-the-panda-for-ios-developers-251aa9a09eb1
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__D45txEqR7zbOYXN7.jpg)

Data processing, handling, cleaning, and shaping plays a crucial role in Machine Learning. Panda, a powerful python package is one of the most sought after libraries used by data scientists to perform transformations on their datasets.

Despite having an easy syntax, Panda requires a steep learning curve. More so, because there are plenty of functions available for a variety of use cases and it takes time to get a hang of it all. Apple, through CreateML aims at bridging the gap between machine learning and application development to allow mobile developers to train and deploy models for on-device machine learning.

The introduction of Create ML, an easy to use interface to train different types of models by using pre-built templates and algorithms, has been a game-changer of sorts. And with the release of `MLDataTable`, Apple strives to make data processing easier for mobile developers, by providing a spreadsheet-like data structure with an easier learning curve in comparison to Pandas.

### MLDataTable — Under The Hood

[MLDataTable](https://developer.apple.com/documentation/createml/mldatatable) is a useful data structure for managing tabular data. It has most of the functionalities of the Panda library, thereby making it the Panda for iOS and macOS Developers.

Besides being useful for parsing JSON and CSV datasets, MLDataTable is used in the following Create ML model templates:

*   [MLRegressor](https://developer.apple.com/documentation/createml/mlregressor)
*   [MLClassifier](https://developer.apple.com/documentation/createml/mlclassifier)
*   [MLTextClassifier](https://developer.apple.com/documentation/createml/mltextclassifier) and [MLWordTagger](https://developer.apple.com/documentation/createml/mlwordtagger)
*   [MLRecommender](https://developer.apple.com/documentation/createml/mlrecommender)

#### Our Goal

In the next few sections, we’ll be exploring the functionalities offered by MLDataTable to make data manipulation easy and fun, especially for mobile developers.

### Reading And Parsing Files

A majority of datasets are in either JSON or CSV file formats. With MLDataTable, parsing such files into a tabular form by using Create ML is quick and easy. To begin with, you need to create a macOS playground in your Xcode and `import CreateML` :

import CreateML  
import CreateMLUI

var data = try MLDataTable(contentsOf: URL(fileURLWithPath: "path/to/your/file/movie\_metadata.csv"))

On running the above code in the playground, you can view the tabular data in the playground previews as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__dQ7tUx1lhIX3cMqdfIrFOA.png)

To get a hold of the column names and types simply there are getter properties `columnNames` and `columnTypes` available.

Additionally, we can set our own parsing options in the `MLDataTable` initializer. With options like `skipRows`,`selectColumns` , `maxRows` we can filter data from the files into our table.

### Dictionaries To Dataset

A dictionary of column names and data values(which conform to the `MLDataValueConvertible` protocol) can be converted to a `MLDataTable` as well. The following code creates a dummy movie dataset consists of three rows and two columns:

let movieData: \[String: MLDataValueConvertible\] = \[

"Title": \["Titanic", "Shutter Island", "Warriors"\],  
"Director": \["James Cameron", "Martin Scorsese", "Gavin O'Connor"\]

\]

var movieTable = try MLDataTable(dictionary: movieData)

### Deriving New Data Tables

MLDataTable can be split, merged or transformed to generate an entirely new data table.

#### Splitting And Sorting Tables

The following code is used to divide a `MLDataTable` into training and test datasets, which are used for model training and evaluation:

let (trainingData, testingData) = data.randomSplit(by: 0.8, seed: 5)

MLDataTables can be sorted by a particular column to give rise to a new MLDataTable:

data = data.sort(columnNamed: "director\_name")

#### Merging Two Tables

Datasets such as the ones in recommender systems need this often. To do so we can use:

*   `func append(contentsOf: MLDataTable)` — adds a new table at the end of the current `MLDataTable`
*   `func join(with: MLDataTable, on columnsNamed: [], type: .inner)` — merges rows based on the matching columns. If the columnNames are set as empty, it assumes all columns in the join.

### CRUD Operations

Performing operations such as adding, removing, updating columns and data is a fairly common use case in data processing. For that, MLDataTable provides us with the following functions.

#### Adding, Removing, Renaming Columns

To add a column to the MLDataTable, simply append the `MLDataColumn` consists of row values. The following code extends the movie dictionary to MLDataTable dataset we created earlier with a new column:

var movieTable = try MLDataTable(dictionary: movieData)

let genreColumn = MLDataColumn(\["Drama", "Thriller", "Drama"\])

movieTable.addColumn(genreColumn, named: "Genre")

For removing a column, we simply invoke the `removeColumn` method on the `MLDataTable` instance with the column name string.

movieTable.removeColumn(named: “Genre”)

To rename an existing column to a new name, simply invoke the `func renameColumn(named: String, to: String)` function on the MLDataTable instance.

#### Drop Duplicates Rows, Fill Missing Columns

While Panda provides functions such as `fillna()` and `drop_duplicates` for filling missing column values and dropping duplicating rows based on a certain set of conditions, MLDataTable has the following equivalent methods:

movieTable.dropDuplicates()

movieTable.fillMissing(columnNamed: "Title", with: MLDataValue.string("NA"))

The `dropDuplicates` function removes duplicates and returns a `MLDataTable` containing all duplicate rows. Additionally, the function`dropMissing` is used to drop rows with missing values.

> To transform a column to a new one, we can use the map function which allows updating all the rows in a thread-safe manner.

### Data Visualization And Exporting

Using the `show()` function on the MLDataTable instance we can view the tabular data in a visual manner in our playgrounds as shown below:

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__ttQA__0wT1MyVzNdutyNsgQ.png)

Finally, exporting the MLDataTable to a CSV or JSON file is possible using the `write` function. Many Create ML application templates require a CSV format, so the following function is fairly important:

try trainingData.writeCSV(to: URL(fileURLWithPath: "path/file.csv"))

### Conclusion

So, we’ve explored the different use cases of MLDataTable and saw how easy it is for mobile developers looking to join the machine learning bandwagon, to use this awesome Create ML structure.

The idea of sharing the importance of MLDataTable in this piece came while I was working on another [story](https://towardsdatascience.com/classifying-movie-reviews-with-natural-language-framework-12dfe2fc3308). Only if time travel was possible, I’d rewrite that piece by using MLDataTable instead of Pandas for dataset importing and exporting to Create ML.

That’s it for this one. I hope you enjoyed reading.