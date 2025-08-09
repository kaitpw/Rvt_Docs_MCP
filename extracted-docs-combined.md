**Namespace:** Autodesk.Revit.DB

# FilterStringLess

**Type:** Class

## Description

Tests whether string values from the document would sort before a certain string.

## Remarks

All string comparisons in this class are performed in the case-insensitive manner.

## Hierarchy

**Inheritance Hierarchy:** System.Object Autodesk.Revit.DB.FilterStringRuleEvaluator Autodesk.Revit.DB.FilterStringLess

## Syntax

```csharp
public class FilterStringLess : FilterStringRuleEvaluator
```

```csharp
public class FilterStringLess : FilterStringRuleEvaluator
```

```vbnet
Public Class FilterStringLess _ Inherits FilterStringRuleEvaluator
```

```cpp
public ref class FilterStringLess : public FilterStringRuleEvaluator
```

---

**Namespace:** Autodesk.Revit.DB.Analysis

# RouteAnalysisSettings

**Type:** Class

## Description

RouteAnalysisSettings is an element which contains project-wide settings for route calculations. The PathOfTravel element uses these settings to calculate a route between two points in a plan view.

## Hierarchy

**Inheritance Hierarchy:** System.Object Autodesk.Revit.DB.Element Autodesk.Revit.DB.Analysis.RouteAnalysisSettings

## Syntax

```csharp
public class RouteAnalysisSettings : Element
```

```csharp
public class RouteAnalysisSettings : Element
```

```vbnet
Public Class RouteAnalysisSettings _ Inherits Element
```

```cpp
public ref class RouteAnalysisSettings : public Element
```

---

**Namespace:** Autodesk.Revit.DB.Analysis Class: RouteAnalysisSettings

# IsLargeGeometryAllowed

**Type:** Method

## Description

Returns if large geometry is allowed for path of travel creation or not.

## Remarks

The return value is based off the current setting for the AllowLargeGeometry Property as follows: - If it is set to Prompt, then prompts the user to continue or not, if no ui is present, returns false.- If it is set to DisAllaow, returns false.- If it is set to Allow, returns true.

## Syntax

```csharp
public bool IsLargeGeometryAllowed()
```

```csharp
public bool IsLargeGeometryAllowed()
```

```vbnet
Public Function IsLargeGeometryAllowed As Boolean
```

```cpp
public: bool IsLargeGeometryAllowed()
```

---

**Namespace:** Autodesk.Revit.DB.Plumbing Class: Pipe

# Create

**Type:** Method

## Description

Creates a new pipe from two points.

## Syntax

```csharp
public static Pipe Create( Document document, ElementId systemTypeId, ElementId pipeTypeId, ElementId levelId, XYZ startPoint, XYZ endPoint )
```

```csharp
public static Pipe Create( Document document, ElementId systemTypeId, ElementId pipeTypeId, ElementId levelId, XYZ startPoint, XYZ endPoint )
```

```vbnet
Public Shared Function Create ( _ document As Document, _ systemTypeId As ElementId, _ pipeTypeId As ElementId, _ levelId As ElementId, _ startPoint As XYZ, _ endPoint As XYZ _ ) As Pipe
```

```cpp
public: static Pipe^ Create( Document^ document, ElementId^ systemTypeId, ElementId^ pipeTypeId, ElementId^ levelId, XYZ^ startPoint, XYZ^ endPoint )
```

| Parameter | Type | Description |
|---|---|---|
| document | Autodesk.Revit.DB.Document | The document. |
| systemTypeId | Autodesk.Revit.DB.ElementId | The ElementId of the piping system type. |
| pipeTypeId | Autodesk.Revit.DB.ElementId | The ElementId of the pipe type. |
| levelId | Autodesk.Revit.DB.ElementId | The level ElementId for the pipe. |
| startPoint | Autodesk.Revit.DB.XYZ | The start point of the pipe. |
| endPoint | Autodesk.Revit.DB.XYZ | The end point of the pipe. |

| Type | Description |
|---|---|
| Autodesk.Revit.Exceptions.ArgumentException | The pipe. |

| Exception | Condition |
|---|---|
| Autodesk.Revit.Exceptions.ArgumentException | The systemTypeId is not valid piping system type. -or- The pipe type pipeTypeId is not valid pipe type. -or- The ElementId levelId is not a Level. -or- The points of startPoint and endPoint are too close: for MEPCurve, the minimum length is 1/10 inch. |
| Autodesk.Revit.Exceptions.ArgumentNullException | A non-optional argument was null |
| Autodesk.Revit.Exceptions.DisabledDisciplineException | None of the following disciplines is enabled: Mechanical Electrical Piping. |

---

**Namespace:** Autodesk.Revit.DB

# FilteredElementCollector

**Type:** Class

## Description

This class is used to search, filter and iterate through a set of elements.

## Remarks

Developers can assign a variety of conditions to filter the elements that are returned. This class requires that at least one condition be set before making the attempt to access the elements. Revit will attempt to organize the filters in order to minimize expansion of elements regardless of the order in which conditions and filters are applied. There are three groups of methods that you can use on a given collector once you have applied filter(s) to it. One group provides collections of all passing elements, a second finds the first match of the given filter(s), and a third provides an iterator that is evaluated lazily (each element is tested by the filter only when the iterator reaches it). You should only use one of the methods from these group at a time; the collector will reset if you call another method to extract elements. Thus, if you have previously obtained an iterator, it will be stopped and traverse no more elements if you call another method to extract elements. In .NET, this class supports the IEnumerable interface for Elements. You can use this class with LINQ queries and operations to process lists of elements. Note that because the ElementFilters and the shortcut methods offered by this class process elements in native code before their managed wrappers are generated, better performance will be obtained by using as many native filters as possible on the collector before attempting to process the results using LINQ queries. One special consideration when using this class in .NET: the debugger will attempt to traverse the members of the collector because of its implementation of IEnumerable. You may see strange results if you also attempt to extract the first element or all elements from the collector while the debugger is also looking at the contents of the collector.

## Hierarchy

**Inheritance Hierarchy:** System.Object Autodesk.Revit.DB.FilteredElementCollector

## Syntax

```csharp
public class FilteredElementCollector : IEnumerable<Element>, IDisposable
```

```csharp
public class FilteredElementCollector : IEnumerable<Element>, IDisposable
```

```vbnet
Public Class FilteredElementCollector Implements IEnumerable(Of Element), IDisposable
```

```cpp
public ref class FilteredElementCollector : IEnumerable<Element^>, IDisposable
```

```csharp
type FilteredElementCollector = class interface IEnumerable<Element> interface IDisposable end
```

| Name | Description | Inherited From |
|---|---|---|
| FilteredElementCollector(Document) | Constructs a new FilteredElementCollector that will search and filter the set of elements in a document. |  |
| FilteredElementCollector(Document, ElementId) | Constructs a new FilteredElementCollector that will search and filter the visible elements in a view. |  |
| FilteredElementCollector(Document, ICollection<ElementId>) | Initializes a new instance of the FilteredElementCollector class |  |
| FilteredElementCollector(Document, ElementId, ElementId) | Constructs a new FilteredElementCollector that will search and filter the visible elements from a Revit link in a host document view. |  |

| Name | Description | Inherited From |
|---|---|---|
| IsValidObject | Specifies whether the .NET object represents a valid Revit entity. |  |

| Name | Description | Inherited From |
|---|---|---|
| ContainedInDesignOption | Applies an ElementDesignOptionFilter to the collector. |  |
| Dispose | Releases all resources used by the FilteredElementCollector |  |
| Equals | Determines whether the specified object is equal to the current object. (Inherited from Object ) | Object |
| Excluding |  |  |
| FirstElement | Returns the first element to pass the filter(s). |  |
| FirstElementId | Returns the id of the first element to pass the filter(s). |  |
| GetBasicIEnumerator | Returns an enumerator that iterates through a collection. |  |
| GetElementCount | Gets the number of elements in your current filter. |  |
| GetElementIdIterator | Returns an element id iterator to the elements passing the filters. |  |
| GetElementIterator | Returns an element iterator to the elements passing the filters. |  |
| GetEnumerator | Returns an enumerator that iterates through a collection. |  |
| GetHashCode | Serves as the default hash function. (Inherited from Object ) | Object |
| GetType | Gets the Type of the current instance. (Inherited from Object ) | Object |
| IntersectWith | Intersects the set of elements passing the filter in this collector with the set of elements passing the filter in another collector. |  |
| IsViewValidForElementIteration | Identifies if the particular element is valid for iteration of drawn elements. |  |
| OfCategory | Applies an ElementCategoryFilter to the collector. |  |
| OfCategoryId | Applies an ElementCategoryFilter to the collector. |  |
| OfClass | Applies an ElementClassFilter to the collector. |  |
| OwnedByView | Applies an ElementOwnerViewFilter to the collector. |  |
| ToElementIds | Returns the complete set of element ids that pass the filter(s). |  |
| ToElements | Returns the complete set of elements that pass the filter(s). |  |
| ToString | Returns a string that represents the current object. (Inherited from Object ) | Object |
| UnionWith | Unites the set of elements passing the filter in this collector with the set of elements passing the filter in another collector. |  |
| WhereElementIsCurveDriven | Applies an ElementIsCurveDrivenFilter to the collector. |  |
| WhereElementIsElementType | Applies an ElementIsElementTypeFilter to the collector. |  |
| WhereElementIsNotElementType | Applies an inverted ElementIsElementTypeFilter to the collector. |  |
| WhereElementIsViewIndependent | Applies an ElementOwnerViewFilter to the collector. |  |
| WherePasses | Applies an element filter to the collector. |  |

---

**Namespace:** Autodesk.Revit.DB.Analysis

# RouteAnalysisSettings

**Type:** Class

## Description

RouteAnalysisSettings is an element which contains project-wide settings for route calculations. The PathOfTravel element uses these settings to calculate a route between two points in a plan view.

## Hierarchy

**Inheritance Hierarchy:** System.Object Autodesk.Revit.DB.Element Autodesk.Revit.DB.Analysis.RouteAnalysisSettings

## Syntax

```csharp
public class RouteAnalysisSettings : Element
```

```csharp
public class RouteAnalysisSettings : Element
```

```vbnet
Public Class RouteAnalysisSettings Inherits Element
```

```cpp
public ref class RouteAnalysisSettings : public Element
```

```csharp
type RouteAnalysisSettings = class inherit Element end
```

| Name | Description | Inherited From |
|---|---|---|
| AnalysisZoneBottomOffset | The bottom plane offset, in ft, of the zone used in route calculation. Default value is 8". |  |
| AnalysisZoneTopOffset | The top plane offset, in ft, for the zone used in route calculation. Default value is 6'8". |  |
| AssemblyInstanceId | The id of the assembly instance to which the element belongs. (Inherited from Element ) | Element |
| BoundingBox | Retrieves a box that circumscribes all geometry of the element. (Inherited from Element ) | Element |
| Category | Retrieves a Category object that represents the category or sub category in which the element resides. (Inherited from Element ) | Element |
| CreatedPhaseId | Id of a Phase at which the Element was created. (Inherited from Element ) | Element |
| DemolishedPhaseId | Id of a Phase at which the Element was demolished. (Inherited from Element ) | Element |
| DesignOption | Returns the design option to which the element belongs. (Inherited from Element ) | Element |
| Document | Returns the Document in which the Element resides. (Inherited from Element ) | Element |
| EnableIgnoredCategoryIds | When this setting is true, elements with category ids returned by GetIgnoredCategoryIds will be ignored in route calculation. default is true as all elements with the Door Category Id are ignored by default. |  |
| Geometry | Retrieves the geometric representation of the element. (Inherited from Element ) | Element |
| GroupId | The id of the group to which an element belongs. (Inherited from Element ) | Element |
| Id | A unique identifier for an Element in an Autodesk Revit project. (Inherited from Element ) | Element |
| IgnoreImports | If true, import instances are ignored by route calculation. For imports to be ignored, also EnableIgnoredCategoryIds must be set to true. |  |
| IsModifiable | Identifies if the element is modifiable. (Inherited from Element ) | Element |
| IsTransient | Indicates whether an element is transient or permanent. (Inherited from Element ) | Element |
| IsValidObject | Specifies whether the .NET object represents a valid Revit entity. (Inherited from Element ) | Element |
| LevelId | The id of the level associated with the element. (Inherited from Element ) | Element |
| Location | This property is used to find the physical location of an element within a project. (Inherited from Element ) | Element |
| MinimumLength | The constant storing minimum allowed length of path of travel |  |
| Name | A human readable name for the Element. (Inherited from Element ) | Element |
| OwnerViewId | The id of the view that owns the element. (Inherited from Element ) | Element |
| Parameter[BuiltInParameter] | Retrieves a parameter from the element given a parameter id. (Inherited from Element ) | Element |
| Parameter[Definition] | Retrieves a parameter from the element based on its definition. (Inherited from Element ) | Element |
| Parameter[Guid] | Retrieves a parameter from the element given a GUID for a shared parameter. (Inherited from Element ) | Element |
| Parameters | Retrieves a set containing all of the parameters that are contained within the element. (Inherited from Element ) | Element |
| ParametersMap | Retrieves a map containing all of the parameters that are contained within the element. (Inherited from Element ) | Element |
| Pinned | Identifies if the element has been pinned to prevent changes. (Inherited from Element ) | Element |
| UniqueId | A stable unique identifier for an element within the document. (Inherited from Element ) | Element |
| VersionGuid | Get the element version Guid. (Inherited from Element ) | Element |
| ViewSpecific | Identifies if the element is owned by a view. (Inherited from Element ) | Element |
| WorksetId | Get Id of the Workset which owns the element. (Inherited from Element ) | Element |

| Name | Description | Inherited From |
|---|---|---|
| ArePhasesModifiable | Returns true if the properties CreatedPhaseId and DemolishedPhaseId can be modified for this Element. (Inherited from Element ) | Element |
| CanBeHidden | Indicates if the element can be hidden in the view. (Inherited from Element ) | Element |
| CanBeLocked | Identifies if the element can be locked. (Inherited from Element ) | Element |
| CanDeleteSubelement | Checks if given subelement can be removed from the element. (Inherited from Element ) | Element |
| CanHaveTypeAssigned() | Identifies if the element can have a type assigned. (Inherited from Element ) | Element |
| ChangeTypeId(ElementId) | Changes the type of the element. (Inherited from Element ) | Element |
| DeleteEntity | Deletes the existing entity created by %schema% in the element (Inherited from Element ) | Element |
| DeleteSubelement | Removes a subelement from the element. (Inherited from Element ) | Element |
| DeleteSubelements | (Inherited from Element ) | Element |
| Dispose | (Inherited from Element ) | Element |
| Equals | Determines whether the specified object is equal to the current object. (Inherited from Object ) | Object |
| EvaluateAllParameterValues | Evaluates all the parameters' values of the element. (Inherited from Element ) | Element |
| EvaluateParameterValues | (Inherited from Element ) | Element |
| GetDependentElements | Get all elements that, from a logical point of view, are the children of this Element. (Inherited from Element ) | Element |
| GetEntity | Returns the existing entity corresponding to the Schema if it has been saved in the Element, or an invalid entity otherwise. (Inherited from Element ) | Element |
| GetEntitySchemaGuids | Returns the Schema guids of any Entities stored in this element. (Inherited from Element ) | Element |
| GetExcludedCategoryIds | Returns ElementIds for Category elements which are excluded (not taken into account) by route calculation. These categories are always excluded, regardless of the EnableIgnoredCategoryIds value. If an excluded category has sub-categories, then the sub-categories will be excluded as well. |  |
| GetExternalFileReference | Gets information pertaining to the external file referenced by the element. (Inherited from Element ) | Element |
| GetExternalResourceReference | Gets the ExternalResourceReference associated with a specified external resource type. (Inherited from Element ) | Element |
| GetExternalResourceReferenceExpanded | Gets the collection of ExternalResourceReference associated with a specified external resource type. (Inherited from Element ) | Element |
| GetExternalResourceReferences | Gets the map of the external resource references referenced by the element. (Inherited from Element ) | Element |
| GetExternalResourceReferencesExpanded | Gets the expanded map of the external resource references referenced by the element. (Inherited from Element ) | Element |
| GetGeneratingElementIds | Returns the ids of the element(s) that generated the input geometry object. (Inherited from Element ) | Element |
| GetGeometryObjectFromReference | Retrieve one geometric primitive contained in the element given a reference. (Inherited from Element ) | Element |
| GetHashCode | Serves as the default hash function. (Inherited from Object ) | Object |
| GetIgnoredCategoryIds | Returns ElementIds for Category elements which are ignored (not taken into account) route calculation. To enable ignoring of these categories, EnableIgnoredCategoryIds must be set to true. If an ignored category has sub-categories, then the sub-categories will be ignored as well. |  |
| GetMaterialArea | Gets the area of the material with the given id. (Inherited from Element ) | Element |
| GetMaterialIds | Gets the element ids of all materials present in the element. (Inherited from Element ) | Element |
| GetMaterialVolume | Gets the volume of the material with the given id. (Inherited from Element ) | Element |
| GetMonitoredLinkElementIds | Provides the link instance IDs when the element is monitoring. (Inherited from Element ) | Element |
| GetMonitoredLocalElementIds | Provides the local element IDs when the element is monitoring. (Inherited from Element ) | Element |
| GetOrderedParameters | Gets the parameters associated to the element in order. (Inherited from Element ) | Element |
| GetParameter | Retrieves a parameter from the element given identifier. (Inherited from Element ) | Element |
| GetParameterFormatOptions | Returns a FormatOptions override for the element Parameter, or a default FormatOptions if no override exists. (Inherited from Element ) | Element |
| GetParameters | Retrieves the parameters from the element via the given name. (Inherited from Element ) | Element |
| GetPhaseStatus | Gets the status of a given element in the input phase (Inherited from Element ) | Element |
| GetRouteAnalysisSettings | Returns the RouteAnalysisSettings element for a given document. |  |
| GetSubelements | Returns the collection of element subelements. (Inherited from Element ) | Element |
| GetType | Gets the Type of the current instance. (Inherited from Object ) | Object |
| GetTypeId | Returns the identifier of this element's type. (Inherited from Element ) | Element |
| GetValidTypes() | Obtains a set of types that are valid for this element. (Inherited from Element ) | Element |
| HasPhases | Returns true if this Element has the properties CreatedPhaseId and DemolishedPhaseId. (Inherited from Element ) | Element |
| IsCreatedPhaseOrderValid | Returns true if createdPhaseId and demolishedPhaseId are in order. (Inherited from Element ) | Element |
| IsDemolishedPhaseOrderValid | Returns true if createdPhaseId and demolishedPhaseId are in order. (Inherited from Element ) | Element |
| IsExternalFileReference | Determines whether this Element represents an external file. (Inherited from Element ) | Element |
| IsHidden | Identifies if the element has been permanently hidden in the view. (Inherited from Element ) | Element |
| IsLargeGeometryAllowed | Returns if large geometry is allowed for path of travel creation or not. |  |
| IsMonitoringLinkElement | Indicate whether an element is monitoring any elements in any linked models. (Inherited from Element ) | Element |
| IsMonitoringLocalElement | Indicate whether an element is monitoring other local elements. (Inherited from Element ) | Element |
| IsPhaseCreatedValid | Returns true if createdPhaseId is an allowed value for the property CreatedPhaseId in this Element. (Inherited from Element ) | Element |
| IsPhaseDemolishedValid | Returns true if demolishedPhaseId is an allowed value for the property DemolishedPhaseId in this Element. (Inherited from Element ) | Element |
| IsValidType(ElementId) | Checks if given type is valid for this element. (Inherited from Element ) | Element |
| LookupParameter | Attempts to find a parameter on the element which has the given name. (Inherited from Element ) | Element |
| RefersToExternalResourceReference | Determines whether this Element uses external resources associated with a specified external resource type. (Inherited from Element ) | Element |
| RefersToExternalResourceReferences | Determines whether this Element uses external resources. (Inherited from Element ) | Element |
| SetEntity | Stores the entity in the element. If an Entity described by the same Schema already exists, it is overwritten. (Inherited from Element ) | Element |
| SetIgnoredCategoryIds |  |  |
| ToString | Returns a string that represents the current object. (Inherited from Object ) | Object |

---

**Namespace:** Autodesk.Revit.DB.Structure.StructuralSections Class: StructuralSectionGeneralS

# StructuralSectionGeneralS

**Type:** Constructor

## Description

Creates a new instance of Round Bar shape.

## Syntax

```csharp
public StructuralSectionGeneralS( double diameter, double centroidHorizontal, double centroidVertical, StructuralSectionAnalysisParams analysisParams )
```

```csharp
public StructuralSectionGeneralS( double diameter, double centroidHorizontal, double centroidVertical, StructuralSectionAnalysisParams analysisParams )
```

```vbnet
Public Sub New ( _ diameter As Double, _ centroidHorizontal As Double, _ centroidVertical As Double, _ analysisParams As StructuralSectionAnalysisParams _ )
```

```cpp
public: StructuralSectionGeneralS( double diameter, double centroidHorizontal, double centroidVertical, StructuralSectionAnalysisParams^ analysisParams )
```

| Parameter | Type | Description |
|---|---|---|
| diameter | System.Double | Pipe Diameter. |
| centroidHorizontal | System.Double | Distance from centroid to the left extremites along horizontal axis. |
| centroidVertical | System.Double | Distance from centroid to the upper extremites along vertical axis. |
| analysisParams | Autodesk.Revit.DB.Structure.StructuralSections.StructuralSectionAnalysisParams | Common set of parameters for structural analysis. |